interface IFamilyMember {
    id: string;
    name: string;
    children: string[];
    gender: string; // OR use an enum
    parents: string[];
}

export default IFamilyMember;
