import {useEffect} from 'react';

const useFavicon = (path, type = 'image/x-icon') => {
    useEffect(() => {
        const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
        link.rel = 'shortcut icon';
        link.type = type;
        link.href = path;
        document.querySelector('head').appendChild(link);
    }, [path, type]);
};

export default useFavicon;


/*
How to use
Import hook :

import useFavicon from "hooks/useFavicon";
Then use like this :

useFavicon("/path/image.png","image/png");
result :

<link rel="icon" type="image/png" href="/path/image.png">*/
