import { withStyles } from "@material-ui/core/styles"
import Button from "@material-ui/core/Button"

export const ThemeButton = withStyles({
  root: {
    background: "#5CC6B3",
    borderRadius: 100,
    color: "white",
    padding: "1rem 2rem",
    "&:hover": {
      backgroundColor: "#6ae2cc",
    },
  },
  label: {
    fontWeight: 600,
    textTransform: "none",
    fontFamily: "Gilroy",
    fontSize: "24px",
    lineHeight: "29px",
  },
})(Button)

export const TimelineButton = withStyles({
    root: {
      padding: "0 1rem 0 1rem",
      borderRadius: 100,
      color: "white",
    },
    label: {
      fontWeight: 600,
      textTransform: "none",
      fontFamily: "Gilroy",
      fontSize: "20px",
      lineHeight: "25px",
    },
  })(Button)
