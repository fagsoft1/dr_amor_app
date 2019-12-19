import {useState, useRef} from "react";

const useFullscreen = () => {
    const [isFS, setIsFS] = useState(false);
    const elementFS = useRef();

    const triggerFS = () => {
        const el = elementFS.current;

        if (el) {
            el.requestFullscreen && el.requestFullscreen();
            el.mozRequestFullScreen && el.mozRequestFullScreen();
            el.webkitRequestFullscreen && el.webkitRequestFullscreen();
            el.msRequestFullscreen && el.msRequestFullscreen();
        }

        setIsFS(true);
    };

    const exitFS = () => {
        const elFS = elementFS.current.ownerDocument.fullscreen;

        if (isFS && elFS) {
            document.exitFullscreen();
            document.exitFullscreen && document.exitFullscreen();
            document.mozCancelFullScreen && document.mozCancelFullScreen();
            document.webkitExitFullscreen && document.webkitExitFullscreen();
            document.msExitFullscreen && document.msExitFullscreen();
        }

        setIsFS(false);
    };

    return {elementFS, triggerFS, exitFS, isFS};
};

export default useFullscreen;


/*
Useful hook if you want to fullscreen an element of your page.

How to use
Import hook :

import useFullscreen from "hooks/useFullscreen";
Add :

const { elementFS, triggerFS, exitFS, isFS } = useFullscreen();
Then use like this :

<div ref="{elementFS}">I want to fullscreen this div.</div>
<button onClick="{triggerFS}">Trigger fullscreen</button>
<button onClick="{exitFS}">Exit fullscreen</button>
Check if fullscreen is triggered :

console.log(isFS);*/
