/**
 * Utility classes for managing States in different ways.
 */

/**
 * Represents the core state management class.
 */
class CoreState {
    /**
     * The current private state value.
     * @type {any}
     * @private
     */
    #current;
    /**
     * Creates an instance of CoreState.
     * @constructor
     * @param {any} current - The initial state value.
     */
    constructor(current) {
        /**
         * The current private state value.
         * @type {any}
         * @private
         */
        this.#current = current;

        /**
         * Array of listeners for state change.
         * @type {Function[]}
         */
        this._stateChangeListeners = [];
    }

    /**
     * Sets the value of the private _state and notifies listeners.
     * @param {any} value - The new value to set.
     */
    set _state(value) {
        this.#current = value;
        this._notifyStateChangeListeners(value);
    }

    /**
     * Gets the value of the private _state.
     * @returns {any} - The current value of the state.
     */
    get _state() {
        return this.#current;
    }

    /**
     * Notifies all registered state change listeners.
     * @param {any} value - The changed value of the state.
     */
    _notifyStateChangeListeners(value) {
        for (const listener of this._stateChangeListeners) {
            listener(value);
        }
    }

    /**
     * Registers a state change listener.
     * @param {Function} listener - The listener function for state change.
     */
    addStateChangeListener(listener) {
        this._stateChangeListeners.push(listener);
    }
}

/**
 * Represents a state class with a single state property.
 */
class State extends CoreState {
    /**
     * Creates an instance of State.
     * @constructor
     * @param {any} initial - The initial state value.
     */
    constructor(initial) {
        super(initial);
        this.State = initial;
    }

    /**
     * Sets the state value.
     * @param {any} value - The new value to set.
     */
    set State(value) {
        if (this._state !== value) {
            this._state = value;
        }
    }
    /**
     * current value of parent CoreState
     */
    get State(){
        return this._state;
    }
}

/**
 * Represents a state class with enumerated values.
 */
class VanillaEnumState extends CoreState {
    /**
     * Creates an instance of VanillaEnumState.
     * @constructor
     * @param {Object} _params - Parameters for state initialization.
     */
    constructor(_params) {
        super(_params.initialState);
        this._params = _params;
        this.enums = this._params.enums;
        this.State = this._params.initialState;
    }

    /**
     * Sets the state value with enumeration validation.
     * @param {any} value - The new value to set.
     * @throws {TypeError} - If the value is not a valid enum value.
     */
    set State(value) {
        if (Object.values(this.enums).includes(value)) {
            if (this._state !== value) {
                this._state = value;
            }
        } else {
            throw new TypeError("Invalid state value for enumerated state.");
        }
    }
    /**
     * return the current state value of parent CoreState
     */
    get State(){
        return this._state;
    }
}


export {
    State,
    VanillaEnumState
}