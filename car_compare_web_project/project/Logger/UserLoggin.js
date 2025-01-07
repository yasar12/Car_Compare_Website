const { send_compared_cars, increaseVisitorCount } = require("../repositories/userRepository");

class Observer {
    async logComparison(data) {
        const { model1, model2 } = data;
        try {
            // Karşılaştırma loglama
            await send_compared_cars(model1, model2);
            console.log(`Comparison logged: ${model1} vs ${model2}`);
        } catch (error) {
            console.error("Comparison log error:", error);
        }
    }

    async logVisit() {
        try {
            // Ziyaretçi loglama
            await increaseVisitorCount();
            console.log("Visit logged successfully.");
        } catch (error) {
            console.error("Visit log error:", error);
        }
    }
}

class Subject {
    constructor() {
        this.observers = [];
    }

    addObserver(observer) {
        this.observers.push(observer);
    }

    async notifyObservers(eventType, data) {
        for (const observer of this.observers) {
            if (eventType === 'comparison') {
                await observer.logComparison(data);
            } else if (eventType === 'visit') {
                await observer.logVisit();
            }
        }
    }
}

module.exports = { Observer, Subject };