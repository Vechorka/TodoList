type StateType = {
    age: number
    childrenCount: number
    name: string
}
type ActionType = {
    type: string
    [key: string]: any
}


export const userReducer = (state: StateType, action: ActionType): StateType => {
    switch (action.type) {
        case 'INCREMENT-AGE':
            let newState = {...state}
            newState.age = newState.age + 1;
            return newState;
        case 'INCREMENT-CHILDREN-COUNT' :
            let newState1 = {...state}
            newState1.childrenCount = newState1.childrenCount + 1;
            return newState1;

        case 'CHANGE-NAME' :
            let newState2 = {...state}
            newState2.name = action.newName
            return newState2;

        default:
            throw new Error("I don't understand this type")
    }
}
