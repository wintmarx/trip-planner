import React from 'react'
import Header from './header'
import './layout.css'

const Layout: React.FC = ({ children }) => {
    return (
        <div className="page">
            <Header siteTitle={'Trip Planner'} />
            <main className="content">{children}</main>
            <footer
                style={{
                    marginTop: `auto`,
                    background: `#1e90ff`,
                    textAlign: "center",
                    width: '100%',
                }}
            >
                <div
                    style={{
                        color: `white`,
                        textDecoration: `none`,
                        padding: `1rem`,
                    }}
                >
                    © {new Date().getFullYear()}, built by TripPlanner team
    </div>

            </footer>
        </div>
    )
}

export default Layout
