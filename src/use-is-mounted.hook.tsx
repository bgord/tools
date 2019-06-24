import React from "react";

export const useIsMounted = (): boolean => {
	const isMountedRef = React.useRef<boolean>(true);
	React.useEffect(() => {
		isMountedRef.current = true;
		return () => {
			isMountedRef.current = false;
		};
	});
	return !!isMountedRef.current;
};
