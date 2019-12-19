import {useState, useCallback} from "react";

const useToggle = initial => {
    const [open, setOpen] = useState(initial);

    return [open, useCallback(() => setOpen(status => !status))];
};
export default useToggle;

/*
How to use
Import hook :

import useToggle from "hooks/useToggle";
Then use like this :

const [open, toggle] = useToggle(false);

<Button onClick={toggle}>Show filters</Button>;
{open && <Filters />}*/
