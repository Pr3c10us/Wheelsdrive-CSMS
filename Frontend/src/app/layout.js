"use client";
import "./globals.css";
import store from "../redux/store";
import { Provider } from "react-redux";

export const metadata = {
    title: "Wheelsdrive",
    description: "Your platform to monitor charge points",
    icons: {
        icon: "/wheelsdrive-title.svg",
    },
};

export default function RootLayout({ children }) {
    return (
        <Provider store={store}>
            <html className="h-full" lang="en">
                <body className="h-full bg-background font-raleway">
                    {children}
                </body>
            </html>
        </Provider>
    );
}
