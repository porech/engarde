import { trigger, state, animate, style, transition, query, stagger, keyframes, animateChild, group } from '@angular/animations';

export function getScaleInAnimation() {
    return scaleInAnimation();
}

export function scaleInAnimation() {
    return trigger('scaleIn',
            [

                transition(':enter', [
                    style({ transform: "translateX(-100%)"}),
                    style({ transform: "translateX(20%)" , opacity: 0}),
                    style({ transform: "scale(0.9)", opacity: 1 }),
                        animate('.4s ease-out'),
                        //per animazioni di componenti figli
                        query("@*", [animateChild()], {optional: true})

                ]),

                transition(':leave', [
                    //per utilizzare i keyframes direttamente:
                    //animate('.4s ease-out', keyframes([ style({...})]))

                    //group esegue i keyframes in parallelo, solo con group l'animazione è perfetta e asincrona
                    group([
                        animate('.4s ease-out', style({ transform: 'translateY(5%) scale(0.8)', opacity: 0.4})),
                    ]),

                    query("@*", [animateChild()], {optional: true})

                ])
                
            ]
        )


}