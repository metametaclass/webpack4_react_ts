import * as React from "react";
import * as ReactDOM from "react-dom";

interface AppRootProps {
}

class AppRoot extends React.Component<AppRootProps, {}> {
    componentDidMount() {
       document.title = "Demo Project";
    }

    componentWillUnmount() {
    }

    componentDidUpdate(prevProps: AppRootProps) {
    }

    render() {
        console.log("render");
        return (
            <div>
                Demo TypeScript+React project
            </div>
        );
    }
}


console.log("entry point")

ReactDOM.render(
    <AppRoot />,
    document.getElementById("root")
);
