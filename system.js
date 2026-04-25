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
        this.marriageDate = data.marriageDate || "";
        this.marriagePlace = data.marriagePlace || "";
        this.bioTranslations = Person.normalizeTranslations(data.bioTranslations, this.bio);
        this.detailsTranslations = Person.normalizeDetailsTranslations(
            data.detailsTranslations,
            {
                birthPlace: this.birthPlace,
                deathPlace: this.deathPlace,
                livingPlaces: this.livingPlaces,
                burialPlace: this.burialPlace,
                profession: this.profession,
                education: this.education,
                marriagePlace: this.marriagePlace
            }
        );
        this.photoGallery = Array.isArray(data.photoGallery) ? data.photoGallery.filter((item) => typeof item === "string" && item) : [];
        this.isAlive = data.isAlive !== false;
        this.parents = new Set(data.parents || []);
        this.children = new Set(data.children || []);
        this.spouses = new Set(data.spouses || []);
    }

    static normalizeTranslations(value, fallback = "") {
        const base = { ru: "", uz: "", en: "" };
        if (value && typeof value === "object") {
            Object.keys(base).forEach((lang) => {
                base[lang] = typeof value[lang] === "string" ? value[lang] : "";
            });
        }
        if (!base.ru && fallback) base.ru = fallback;
        return base;
    }

    static normalizeDetailsTranslations(value, fallback = {}) {
        const createLang = () => ({
            birthPlace: "",
            deathPlace: "",
            livingPlaces: "",
            burialPlace: "",
            profession: "",
            education: "",
            marriagePlace: ""
        });
        const base = { ru: createLang(), uz: createLang(), en: createLang() };

        if (value && typeof value === "object") {
            Object.keys(base).forEach((lang) => {
                if (!value[lang] || typeof value[lang] !== "object") return;
                Object.keys(base[lang]).forEach((field) => {
                    base[lang][field] = typeof value[lang][field] === "string" ? value[lang][field] : "";
                });
            });
        }

        Object.keys(base.ru).forEach((field) => {
            if (!base.ru[field] && typeof fallback[field] === "string") {
                base.ru[field] = fallback[field];
            }
        });

        return base;
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
            marriageDate: this.marriageDate,
            marriagePlace: this.marriagePlace,
            bioTranslations: this.bioTranslations,
            detailsTranslations: this.detailsTranslations,
            photoGallery: this.photoGallery,
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

    createPerson(data = {}) {
        const person = new Person(data);
        this.people.set(person.id, person);
        if (!this.focusPersonId) this.focusPersonId = person.id;
        return person.id;
    }

    updatePerson(id, data) {
        const person = this.people.get(id);
        if (!person) return false;
        Object.assign(person, data);
        return true;
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
        if (!child || !parent || child.parents.has(parentId) || child.parents.size >= 2) return false;

        child.parents.add(parentId);
        parent.children.add(childId);
        return true;
    }

    addSpouse(id1, id2) {
        if (id1 === id2) return false;
        const first = this.people.get(id1);
        const second = this.people.get(id2);
        if (!first || !second || first.spouses.has(id2)) return false;

        first.spouses.add(id2);
        second.spouses.add(id1);
        return true;
    }

    getStats() {
        let alive = 0;
        let archived = 0;

        this.people.forEach((person) => {
            if (person.isAlive) {
                alive += 1;
            } else {
                archived += 1;
            }
        });

        return {
            total: this.people.size,
            alive,
            archived
        };
    }

    toJSON() {
        return {
            focusPersonId: this.focusPersonId,
            people: Array.from(this.people.values()).map((person) => person.toJSON())
        };
    }

    load(data) {
        this.people.clear();
        if (!data || !Array.isArray(data.people)) return;

        data.people.forEach((item) => {
            const person = new Person(item);
            this.people.set(person.id, person);
        });

        this.focusPersonId = this.people.has(data.focusPersonId)
            ? data.focusPersonId
            : (this.people.keys().next().value || null);
    }
}
