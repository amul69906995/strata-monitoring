export const instrumentName = (code) => {
    switch (code) {
        case "LC":
            return "Load Cells";
        case "SC":
            return "Stress Cells";
        case "INC":
            return "Inclinometers";
        case "CRI":
            return "Convergence rate indicator (CRI)";
        default:
            return "";
    }
}

export const instrumentCode = (name) => {
    switch (name) {
        case "Load Cells":
            return "LC";
        case "Stress Cells":
            return "SC";
        case "Inclinometers":
            return "INC";
        case "Convergence rate indicator (CRI)":
            return "CRI";
        default:
            return "";
    }
}
export const instrumentUnit = (code) => {
    switch (code) {
        case "LC":
            return "kN";
        case "SC":
            return "MPa";
        case "INC":
            return "degrees";
        case "CRI":
            return "mm/day";
        default:
            return "";
    }
}
