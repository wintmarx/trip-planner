import { Tab, Tabs, withStyles } from "@material-ui/core"

const tabsStyles = {
  root: {
    width: "100%",
    // boxShadow: "inset 0 -1px 0 0 rgba(48,48,48,.2)",
  },
  indicator: {
    backgroundColor: "#5cc6b3",
    // backgroundColor: "transparent",
    // '& > span': {
    //   maxWidth: 40,
    //   width: '100%',
    //   backgroundColor: '#635ee7',
    // },
  },
}

const tabItemStyles = {
  root: {
    maxWidth:"250px",
    fontFamily: "Gilroy",
    fontSize: "16px",
    lineHeight: "19px",
    textTransform: "initial" as const,
  },
//   '&:hover': {
//     color: '#40a9ff',
//     opacity: 1,
//   },
//   '&$selected': {
//     color: '#1890ff',
//   },
//   '&:focus': {
//     color: '#40a9ff',
//   },
}

export const ThemeTabs = withStyles(tabsStyles)(Tabs)
export const ThemeTab = withStyles(tabItemStyles)(Tab)
