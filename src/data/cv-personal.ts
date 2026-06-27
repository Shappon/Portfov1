/**
 * Contenu du CV personnel — identité humaine, hors logique « CV papier ».
 */

export const CV_PERSONAL = {
  tagline: "Curieux de nature, patient avec les autres, passionné d'histoire et de ce que la technologie peut changer au quotidien.",
  blocs: [
    {
      id: "qui",
      title: "Qui je suis",
      detail:
        "Je suis quelqu'un qui aime comprendre avant de conclure. J'ai toujours eu besoin de creuser — une époque, un sujet, une idée — pour vraiment m'y sentir à l'aise. Ce n'est pas de la lenteur : c'est ma façon d'être honnête avec ce que je dis et ce que je fais.",
    },
    {
      id: "passions",
      title: "Ce qui m'anime",
      detailSteps: [
        "L'histoire : comprendre comment les choses en sont arrivées là, et ce que ça dit de nous.",
        "La veille technologique : suivre ce qui émerge, sans tout adopter — trier, questionner, garder l'essentiel.",
        "L'IA : pas comme une mode, mais comme un outil qu'il faut apprivoiser avec discernement.",
      ],
    },
    {
      id: "fonctionnement",
      title: "Comment je fonctionne",
      detail:
        "J'explique, j'adapte mon langage, je prends le temps. Que ce soit face à un usager en difficulté ou à un collègue pressé, j'essaie de rendre les choses lisibles — sans simplifier à l'excès, sans noyer sous le jargon. Apprendre en faisant, corriger en chemin : c'est mon rythme naturel.",
    },
    {
      id: "valeurs",
      title: "Ce qui compte pour moi",
      detail:
        "La clarté — dans les mots, dans les gestes, dans ce qu'on promet. La patience — parce que tout le monde n'avance pas au même tempo. Et l'utilité réelle : des outils, des réponses, des accompagnements qui servent quelqu'un, pas juste une démo qui impressionne.",
    },
  ],
} as const;

export type CvPersonalBlocId = (typeof CV_PERSONAL.blocs)[number]["id"];
export type CvPersonalBloc = (typeof CV_PERSONAL.blocs)[number];
