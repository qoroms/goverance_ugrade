import { PersonBoundingBox } from "react-bootstrap-icons";

export const Proposals = (proposalState) => {
    switch(proposalState) {
        case '0': return "Pending";
        case '1': return "Active";
        case '2': return "Canceled";
        case '3': return "Defeated";
        case '4': return "Succeeded";
        case '5': return "Queued";
        case '6': return "Expired";
        case '7': return "Executed";
    }
}