import { withStyles } from "@material-ui/core/styles"
import Button from "@material-ui/core/Button"

export const ThemeButton = withStyles({
  root: {
    background: "#5CC6B3",
    borderRadius: 100,
    color: "white",
    padding: "1.5rem 2rem",
    "&:hover": {
      backgroundColor: "#6ae2cc",
    },
  },
  label: {
    textTransform: "none",
    fontFamily: "Gilroy",
    fontSize: "24px",
    lineHeight: "29px",
  },
})(Button)
