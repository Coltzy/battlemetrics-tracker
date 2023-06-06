import { AutocompleteInteraction } from 'discord.js';
import AutocompleteBase, { AutocompleteMethod } from './base/autocomplete-base';

class IDocumentAutocomplete extends AutocompleteBase {
    private option: string;
    private type: 'players' | 'servers';

    public constructor(type: 'players' | 'servers', option: string, method?: AutocompleteMethod) {
        super(method);

        this.option = option;

        this.type = type;
    }

    public autocomplete(interaction: AutocompleteInteraction) {
        const focused = interaction.options.getFocused(true);
        const docs = interaction.client[this.type].get(interaction.user.id);

        const query = focused.value;

        if (docs && focused.name == this.option) {
            const choices  = docs.map((doc) => ({ name: doc.name, value: doc.id }));
            interaction.respond(choices.filter((choice) => choice.name.toLowerCase().startsWith(query)));
        } else {
            this.method?.(interaction);
        }
    }
}

export default IDocumentAutocomplete;