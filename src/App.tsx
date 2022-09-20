import React from 'react';
import './App.css';
import familyMembersStub from "./stubs/familyMembers.json";
import IFamilyMember from "./Entities/IFamilyMember";
import IDictionary from "./interfaces/IDictionary";
import IFamilyTree from "./Entities/IFamilyTree";
import md5 from 'md5';
import Tree from "./Tree";
import _ from 'lodash';

function App() {
    const denormalizedFamilyMembers: IFamilyMember[] = familyMembersStub;
    const familyMembers: IDictionary<IFamilyMember> = {};
    const familyTrees: IDictionary<IFamilyTree> = {};

    /**
     * Recursive function to build a family tree
     */
    const buildFamilyTree = (familyMember: IFamilyMember): IFamilyTree => {
        const children: IFamilyTree[] = familyMember.children
            .map((loopId: string) => familyMembers[loopId])
            .filter((loopFamilyMember: IFamilyMember) => loopFamilyMember) // The stub data on the exam contains family member IDs that don't exist -- prune those.
            .map((loopFamilyMember: IFamilyMember) => buildFamilyTree(loopFamilyMember))

        const data: IFamilyTree = {
            hash: md5(JSON.stringify(familyMember.children)), // The hash is important to discern same-children trees for merging later
            parents: familyMember.parents.map((id: string) => familyMembers[id]) as [IFamilyMember, IFamilyMember],
            children: children,
        }

        if (familyMember.gender === 'male') {
            data.husband = familyMember;
            data.wife = denormalizedFamilyMembers.find((loopFamilyMember: IFamilyMember) => JSON.stringify(loopFamilyMember.children) === JSON.stringify(familyMember.children) && loopFamilyMember.gender === 'female')
        }

        if (familyMember.gender === 'female') {
            data.wife = familyMember;
            data.husband = denormalizedFamilyMembers.find((loopFamilyMember: IFamilyMember) => JSON.stringify(loopFamilyMember.children) === JSON.stringify(familyMember.children) && loopFamilyMember.gender === 'male')
        }

        return data;
    }

    // We need to create a dictionary (i.e. normalise) family members, so we don't end up with an n+1 issue
    denormalizedFamilyMembers.forEach((member: IFamilyMember) => {
        member.children = member.children.sort(); // Sort the children, so we get a consistent hash value for tree building
        member.parents = member.parents.sort();

        familyMembers[member.id] = member;
    });

    // Build the family tree
    denormalizedFamilyMembers.forEach((familyMember: IFamilyMember) => {
        const familyTree: IFamilyTree = buildFamilyTree(familyMember);

        // Merge family trees that have the same hash
        if (familyTree.parents.length === 0) {
            familyTrees[familyTree.hash] = {...familyTrees[familyTree.hash], ...familyTree};
        }
    });

    return (
        <div className="App">
            <Tree familyTree={_.values(familyTrees)[0]}/>
        </div>
    );
}

export default App;
