export default {
    scrollBehavior(to: { hash: any }, from: any, savedPosition: any) {
        // If an anchor is present in the URL
        if (to.hash) {
            return {
                el: to.hash,
                behavior: "smooth",
            };
        }

        // Normal behavior
        return { top: 0 };
    },
};
