import type { IHeaderParams } from 'ag-grid-community';
import CheckBox from '@/components/headerRenderers/CheckBox.svelte';

export class HeaderCheckRenderer {
    private eGui: HTMLElement | undefined;

    init(params: IHeaderParams) {
        this.eGui = document.createElement('div');
        this.eGui.classList.add('header_2_CheckBox');
        const renderer = new CheckBox({
            target: this.eGui,
            props: { params },
        });
    }

    getGui() {
        return this.eGui!;
    }

    refresh(params: IHeaderParams): boolean {
        return true;
    }
}