import gsap from "gsap"

export function ScrollToHelper(position){
    localStorage.setItem("ScrollTo", position)
}

export function WhiteScreenFlash(func=null){
    gsap.to("#WhiteScreen", {
        onStart: () => {
            func()
        },
        duration: 1,
        opacity: 1,
        onComplete: () => {
            gsap.to("#WhiteScreen", {
                duration: 1,
                opacity: 0,
                ease: "expo.out",
            })
        }
    })
}
