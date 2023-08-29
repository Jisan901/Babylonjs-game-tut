/**
 * Utility class for loading and managing DOM elements with provided IDs.
 */
export default class DomLoader {
    /**
     * Creates an instance of DomLoader.
     * @constructor
     * @param {string[]} domIds - Array of DOM element IDs to be loaded.
     */
    constructor(domIds) {
        /**
         * Array of DOM element IDs to be loaded.
         * @type {string[]}
         */
        this.domIds = domIds;
        
        /**
         * Loaded DOM elements with IDs as keys.
         * @type {Object}
         */
        this.loadedDoms = {};
        
        /**
         * Indicates if the DOM elements are loaded.
         * @type {boolean}
         * @private
         */
        this._domLoaded = false;

        /**
         * Indicates if the loading process is ongoing.
         * @type {boolean}
         * @private
         */
        this._loading = false;

        /**
         * Event callback for the start of the loading process.
         * @type {Function}
         */
        this.onstart = null;

        /**
         * Event callback for each DOM element loaded.
         * @type {Function}
         */
        this.oneach = null;

        /**
         * Event callback for the end of the loading process.
         * @type {Function}
         */
        this.onend = null;

        // Initiating the loading process
        this.__loadDom();
    }

    /**
     * Initiates the loading of DOM elements.
     * @private
     */
    __loadDom() {
        // Event: Loading process starts
        this.onstart && this.onstart(null);

        // Mark the loading process as ongoing
        this._loading = true;

        // Loop through each provided DOM ID
        for (let i = 0; i < this.domIds.length; i++) {
            const item = this.domIds[i];
            const loaded = document.getElementById(item);
            // Store the loaded DOM element
            this.loadedDoms[item] = loaded;
            // Event: Each DOM element loaded
            this.oneach && this.oneach(loaded);
        }

        // Mark the loading process as completed
        this._loading = false;
        this._domLoaded = true;

        // Event: Loading process ends
        this.onend && this.onend(null);
    }
}

/*
* @thanks to chatgpt for doc comment :)
*/