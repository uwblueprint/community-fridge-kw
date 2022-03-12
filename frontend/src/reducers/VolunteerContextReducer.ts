import {
    VolunteerContextAction,
    VolunteerContextType
} from "../types/VolunteerTypes";

export default function volunteerContextReducer(
    state: VolunteerContextType,
    action: VolunteerContextAction
): VolunteerContextType {
    switch (action.type) {
        case "SET_VOLUNTEER_ID":
            return {
                ...state,
                volunteerId: action.value
            }
        case "SET_VOLUNTEER_STATUS":
            return {
                ...state,
                volunteerStatus: action.value
            }
        default:
            return state;
    }
}
