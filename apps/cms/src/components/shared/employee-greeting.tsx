import {
    Item,
    ItemContent,
    ItemDescription,
    ItemMedia,
    ItemTitle,
} from "@/components/ui/item"
import { Laugh } from "lucide-react"

export default function EmployeeGreeting() {
    return (
        <Item variant="outline">
            <ItemContent>
                <ItemTitle className="text-foreground font-semibold text-4xl md:text-5xl lg:text-6xl">Привет, как дела?</ItemTitle>
                <ItemDescription className="text-muted-foreground text-lg md:text-xl lg:text-2xl">
                    Чем сегодня займемся?
                </ItemDescription>
            </ItemContent>
        </Item>
    );
}