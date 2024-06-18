
export class CreatePostDto {

    // readonly - это запретит присваивать полю значения за пределами конструктора
    readonly title: string
    readonly content: string
    readonly userId: number
}