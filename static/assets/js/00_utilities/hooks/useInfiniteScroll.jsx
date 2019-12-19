import {useState, useEffect} from "react";

const useInfiniteScroll = callback => {
    const [isFetching, setIsFetching] = useState(false);

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        if (!isFetching) return;
        callback(() => {
            console.log("Loading....");
        });
    }, [isFetching]);

    function handleScroll() {
        if (
            window.innerHeight + document.documentElement.scrollTop !==
            document.documentElement.offsetHeight
        )
            return;
        setIsFetching(true);
    }

    return [isFetching, setIsFetching];
};

export default useInfiniteScroll;


/*
How to use
Import hook :

import useInfiniteScroll from "hooks/useInfiniteScroll";
Then use like this :

const [isFetching, setIsFetching] = useInfiniteScroll(fetchMoreListItems);

function fetchMoreListItems() {
  // Some code for adding content to each user is at the bottom of the page
}
*/
