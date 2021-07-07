import { LightningElement, api, track } from 'lwc';
import pubsub from 'vlocity_cmt/pubsub';

export default class DeLayoutCiConsoleTwoColumn extends LightningElement {
    
    @api recordId;
    
    @track homeTab = true;  // Defaults to the Home Tab
    currentTab = "home";

    connectedCallback() {

        // Register for events
        console.log("Main Frame -> Subscribing to CiConsoleMC");
        pubsub.register("CiConsoleMC", {
            setvalues: this.executeOnEvent.bind(this)
        });
    }

    executeOnEvent(event) {

        try {

            console.log("Main Frame -> Received Event -> " + JSON.stringify(event));

            if (event.category && event.category == "home") this.homeTab = true;
            else this.homeTab = false;

            // Echo Event under certain circumstances
            if (this.currentTab == "home" && event.category != "home" && !event.replay) {

                setTimeout(function () {
                    console.log("replaying event");
                    pubsub.fire("CiConsoleMC", "setvalues", {
                        "category": event.category,
                        "id": event.id,
                        "tab": event.tab,
                        "replay": true
                    });
                }, 100);
            }

            this.currentTab = event.category;

        } catch (err) {
            console.error("Error processing event -> " + err);
        }
    }

   /**
    * Overrides the disconnectedCallback() method to unsubscribe from events.
    * 
    */
   disconnectCallback() {

       // Unregister from events
       console.log("Main Frame -> Unsubscribing from CiConsoleMC");
       pubsub.unregister("CiConsoleMC", {
           setvalues: this.executeOnEvent.bind(this)
       });
   }
}