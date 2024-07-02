export const getInitials = (name, lastName) => {
    if (!name || !lastName) {
        return "";
    }
    let nameInitial = name[0];
    let lastnameInitial = lastName[0];
    return (nameInitial + lastnameInitial).toUpperCase();  
};