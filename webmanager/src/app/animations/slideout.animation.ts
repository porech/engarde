import { trigger, state, animate, style, transition, query, stagger, keyframes, animateChild, group } from '@angular/animations';

export function getSlideOutAnimation() {
    return slideOutAnimation();
}

export function slideOutAnimation() {
    return trigger('slideOut',
            [

                transition(':enter', [
                    style({ transform: "translateY(-30%)"}),
                    style({ transform: "translateX(30%)" , opacity: 0}),
                    style({ transform: "scale(0.9)", opacity: 1 }),
                        animate('.5s ease-out'),
                        //per animazioni di componenti figli
                        query("@*", [animateChild()], {optional: true})

                ]),

                transition(':leave', [
                    //per utilizzare i keyframes direttamente:
                    //animate('.4s ease-out', keyframes([ style({...})]))

                    //group esegue i keyframes in parallelo, solo con group l'animazione è perfetta e asincrona
                    group([
                        animate('.4s ease-out', style({ transform: 'translateY(30%) scale(0.8)', opacity: 0.4})),
                    ]),

                    query("@*", [animateChild()], {optional: true})

                ])
                
            ]
        )


}