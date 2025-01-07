const userrepository = require("../repositories/userRepository");

class UserRepositoryProxy {
    constructor() {
        this.cache = {}; // Önbellek
        this.repository = userrepository; // Gerçek nesne
    }

    async getMarkalar() {
        if (!this.cache["markalar"]) {
            console.log("Veritabanından 'markalar' çekiliyor...");
            this.cache["markalar"] = await this.repository.getMarkalar();
        } else {
            console.log("'markalar' önbellekten alındı.");
        }
        return this.cache["markalar"];
    }

    async getModeller(marka) {
        if (!this.cache[`modeller_${marka}`]) {
            console.log(`Veritabanından '${marka}' için modeller çekiliyor...`);
            this.cache[`modeller_${marka}`] = await this.repository.getModeller(marka);
        } else {
            console.log(`'${marka}' için modeller önbellekten alındı.`);
        }
        return this.cache[`modeller_${marka}`];
    }
}

module.exports = UserRepositoryProxy;
