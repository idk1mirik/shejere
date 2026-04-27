class Person {
    constructor(data = {}) {
        this.id = data.id || Person.createId();
        this.name = data.name || "Без имени";
        this.maidenName = data.maidenName || "";
        this.photo = data.photo || "";
        this.birthDate = data.birthDate || "";
        this.deathDate = data.deathDate || "";
        this.birthPlace = data.birthPlace || "";
        this.deathPlace = data.deathPlace || "";
        this.livingPlaces = data.livingPlaces || "";
        this.burialPlace = data.burialPlace || "";
        this.profession = data.profession || "";
        this.education = data.education || "";
        this.bio = data.bio || "";
        this.isAlive = data.isAlive !== false;
        this.parents = new Set(data.parents || []);
        this.children = new Set(data.children || []);
        this.spouses = new Set(data.spouses || []);
    }

    static createId() {
        if (window.crypto && crypto.randomUUID) {
            return `p_${crypto.randomUUID().slice(0, 8)}`;
        }
        return `p_${Math.random().toString(36).slice(2, 10)}`;
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            maidenName: this.maidenName,
            photo: this.photo,
            birthDate: this.birthDate,
            deathDate: this.deathDate,
            birthPlace: this.birthPlace,
            deathPlace: this.deathPlace,
            livingPlaces: this.livingPlaces,
            burialPlace: this.burialPlace,
            profession: this.profession,
            education: this.education,
            bio: this.bio,
            isAlive: this.isAlive,
            parents: Array.from(this.parents),
            children: Array.from(this.children),
            spouses: Array.from(this.spouses)
        };
    }
}

class FamilyGraph {
    constructor() {
        this.people = new Map();
        this.focusPersonId = null;
    }

    createPerson({ name }) {
        const person = new Person({ name });
        this.people.set(person.id, person);
        return person.id;
    }

    updatePerson(id, data) {
        const person = this.people.get(id);
        if (person) Object.assign(person, data);
    }

    getPerson(id) {
        return this.people.get(id);
    }

    setFocus(id) {
        if (id && this.people.has(id)) this.focusPersonId = id;
    }

    getFocus() {
        return this.focusPersonId;
    }

    addParent(childId, parentId) {
        if (childId === parentId) return false;
        const child = this.people.get(childId);
        const parent = this.people.get(parentId);
        if (!child || !parent || child.parents.has(parentId)) return false;

        child.parents.add(parentId);
        parent.children.add(childId);
        return true;
    }

    addSpouse(id1, id2) {
        if (id1 === id2) return false;
        const p1 = this.people.get(id1);
        const p2 = this.people.get(id2);
        if (!p1 || !p2 || p1.spouses.has(id2)) return false;

        p1.spouses.add(id2);
        p2.spouses.add(id1);
        return true;
    }

    toJSON() {
        return {
            focusPersonId: this.focusPersonId,
            people: Array.from(this.people.values()).map(person => person.toJSON())
        };
    }

    load(data) {
        this.people.clear();
        if (!data || !Array.isArray(data.people)) return;

        data.people.forEach(item => {
            const person = new Person(item);
            this.people.set(person.id, person);
        });

        this.focusPersonId = this.people.has(data.focusPersonId)
            ? data.focusPersonId
            : (this.people.keys().next().value || null);
    }
}
