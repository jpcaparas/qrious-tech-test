import IFamilyTree from "./Entities/IFamilyTree";
import React from 'react';
import "./Tree.css"

type Props = {
    familyTree: IFamilyTree;
}

function Tree(props: Props) {
    const {familyTree} = props;

    return (
        <div className="tree">
            {familyTree.husband && <div className="husband">{familyTree.husband.name}</div>}
            {familyTree.wife && <div className="wife">{familyTree.wife?.name}</div>}
            <div className="children">
                {familyTree.children.map((familyUnit: IFamilyTree) => {
                    return <Tree familyTree={familyUnit} />
                })}
            </div>
        </div>
    );
}

export default Tree;
