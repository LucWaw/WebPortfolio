export function shuffleArray(array: any[]) {
    console.log("shuffling array");
    for (let i = array.length - 1; i > 0; i--) {
        console.log("shuffling index:", i);
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}
