import React from "react"
import PropTypes from "prop-types"
import { Link } from "gatsby"

interface IProps {
    siteTitle: string
}

export default class Header extends React.Component<IProps> {
    constructor(props: IProps) {
        super(props)
    }

    render() {
        return (
            <header
                style={{
                    background: `#1e90ff`,
                }}
            >
                <div
                    style={{
                        margin: `0 auto`,
                        maxWidth: 960,
                        padding: `1.45rem 1.0875rem 1.0875rem 1.0875rem`,
                    }}
                >
                    <h1 style={{ margin: 0 }}>
                        <Link
                            to="/"
                            style={{
                                color: `white`,
                                textDecoration: `none`,
                            }}
                        >
                            {this.props.siteTitle}
                        </Link>
                    </h1>
                    <p style={{
                        margin: 0,
                        color: `white`,
                        textDecoration: `none`,
                        padding: '0.2rem'
                    }}>Guide your trip</p>
                </div>
            </header>
        );
    }
}
