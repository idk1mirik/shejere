// --- КЛАССЫ ---
class Person {
    constructor({ id, name }) {
        this.id = id; 
        this.name = name || "Без имени"; // FIX
        this.maidenName = ""; 
        this.photo = "";
        this.birthDate = ""; 
        this.deathDate = ""; 
        this.birthPlace = "";
        this.deathPlace = ""; 
        this.livingPlaces = ""; 
        this.burialPlace = "";
        this.profession = ""; 
        this.education = ""; 
this.bio = "";
this.isAlive = true; // FIX
this.parents = new Set();
        this.children = new Set(); 
        this.spouses = new Set();
    }
}

class FamilyGraph {
    constructor() { 
        this.people = new Map(); 
        this.focusPersonId = null; 
    }
    
    createPerson({ name }) {
        const id = "p_" + Math.random().toString(36).slice(2, 10);
        this.people.set(id, new Person({ id, name }));
        return id;
    }
    
    updatePerson(id, data) {
        const p = this.people.get(id);
        if (p) Object.assign(p, data);
    }
    
    getPerson(id) { 
        return this.people.get(id); 
    }
    
    setFocus(id) { 
        this.focusPersonId = id; 
    }
    
    getFocus() { 
        return this.focusPersonId; 
    }

    addParent(childId, parentId) {
        const child = this.people.get(childId);
        const parent = this.people.get(parentId);
        if (!child || !parent) return;
    
        child.parents.add(parentId);
        parent.children.add(childId);
    }
    
    addSpouse(id1, id2) {
        const p1 = this.people.get(id1);
        const p2 = this.people.get(id2);
        if (!p1 || !p2) return;
    
        p1.spouses.add(id2);
        p2.spouses.add(id1);
    }
    
}

