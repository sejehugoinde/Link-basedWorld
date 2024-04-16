class Start extends Scene {
    create() {
        this.engine.setTitle(this.engine.storyData.Title);
        this.engine.addChoice("Begin the game");
    }

    handleChoice() {
        this.engine.gotoScene(Location, this.engine.storyData.InitialLocation);
    }
}

class Location extends Scene {
    create(key) {
        let locationData = this.engine.storyData.Locations[key];
        this.engine.show(locationData.Body);

        if (locationData.Items) {
            const acquiredItems = locationData.Items;
            this.engine.inventory.push(...locationData.Items);

            let itemsMessage = "You have acquired new item(s):\n";
            acquiredItems.forEach(item => {
                itemsMessage += `${item}\n`;
            });

            alert(itemsMessage);
        }

        if (locationData.Choices) {
            for (let choice of locationData.Choices) {
                if (locationData.Interactive === true) {
                    this.engine.gotoScene(SpecialLocation, key);
                    return;
                }
                this.engine.addChoice(choice.Text, choice);
            }
        } else {
            this.engine.addChoice("The end.");
        }
    }

    handleChoice(choice) {
        if (choice) {
            this.engine.show("> " + choice.Text);
            this.engine.gotoScene(Location, choice.Target);
        } else {
            this.engine.gotoScene(End);
        }
    }
}

class SpecialLocation extends Location {
    create(key) {
        let locationData = this.engine.storyData.Locations[key];
        if (locationData.Interactive && locationData.Interactive === true) {
            for (let choice of locationData.Choices) {
                if (this.isInteractiveMechanism(choice)) {
                    if (this.doesInventoryContainSpecificItem(choice)) {
                        this.engine.addChoice(choice.Text, choice);
                    }
                } else {
                    this.engine.addChoice(choice.Text, choice);
                }
            }
        }
    }

    handleChoice(choice) {
        if (choice) {
            if (this.isInteractiveMechanism(choice)) {
                this.handleSpecialAction(choice);
            } else {
                this.engine.show("> " + choice.Text);                
                this.engine.gotoScene(Location, choice.Target);
            }
        } else {
            this.engine.gotoScene(End);
        }
    }

    isInteractiveMechanism(choice) {
        return choice.Target === "Tip" || choice.Target === "Purchase Ship Supplies";
    }

    doesInventoryContainSpecificItem(choice) {
        if (choice.Target === "Tip") {
            return this.engine.inventory.includes("Coins");
        }
        if (choice.Target === "Purchase Ship Supplies") {
            return this.engine.inventory.includes("Translation Device");
        }
    }

    handleSpecialAction(choice) {
        if (choice.Target === "Tip") {
            if (this.engine.inventory.includes("Coins")) {
                this.engine.show("> " + choice.Text);
                this.engine.show("You have tipped the bartender");
                this.engine.addChoice("Ship Repair", { Text: "Repair the ship", Target: "Ship Repair" });
            } else {
                this.engine.show("> " + choice.Text);
                this.engine.show("You don't have enough coins to tip the bartender. Maybe you should have gone more exploring...");
                this.engine.addChoice("Ship Repair", { Text: "Repair the ship", Target: "Ship Repair" });
                this.engine.addChoice("Purchase ship supplies", { Text: "Purchase ship supplies", Target: "Purchase Ship Supplies" });
            }
        } else if (choice.Target === "Purchase Ship Supplies") {
            if (this.engine.inventory.includes("Translation Device")) {
                this.engine.show("> " + choice.Text);
                this.engine.show("You have successfully purchased what you needed in order to repair your rocket ship");
                this.engine.addChoice("Ship Repair", { Text: "Repair the ship", Target: "Ship Repair" });
                this.engine.addChoice("Tip the bartender", { Text: "Tip the bartender", Target: "Tip" });
            }
        }
    }
}

class End extends Scene {
    create() {
        this.engine.show("<hr>");
        this.engine.show(this.engine.storyData.Credits);
    }
}

Engine.load(Start, 'myStory.json');