import IFamilyMember from "./IFamilyMember";

interface IFamilyTree {
    hash: string,
    husband?: IFamilyMember
    wife?: IFamilyMember
    parents: [] | [IFamilyMember, IFamilyMember],
    children: IFamilyTree[],
}

export default IFamilyTree;
