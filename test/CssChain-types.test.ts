import {fixture, expect} from '@open-wc/testing';
import {html} from 'lit';
import {CssChain as $$, CssChainT} from '../src/CssChain.js';
import {HTMLElementMixin} from "../src/HTMLElementMixin";

interface A {
    ma: string;
    f(): void;
}

interface B {
    mb: string;
    f(b: string): number;
}

interface C extends A, B {
    // ma: string;
    // mb: string;

    // f();
    // f(b:string);
    f(a?: string, b?: string): number;
}

type ABC = A | B | C;
const getAbc = (i: number): ABC => {
    return i    ? new class implements C {
                    ma = '1';
                    mb = "aa";
                    f(a?:string, b?:string) { return i }
                } : new class implements A {
                    ma='MA';
                    f() { return 0 }
                };
}
let abc: C = getAbc(1) as C;
abc.ma;
abc.mb;
abc.f('1', '2');
(abc as B).f('1');

class DemoElement extends HTMLElement {
    b: string;
    calledFromClick=false;
    calledFromChange='';

    constructor() {
        super();
        this.b = "initial";
    }

    setB(_b: string) {
        this.b = _b;
    }
}
window.customElements.define( 'demo-element', DemoElement);

describe('CssChain', () => {
    const isBlankNodeSet = ($X: CssChainT) => {
        expect(Array.isArray($X)).to.equal(true);
        expect($X).to.be.an('array');
        expect($X.length).to.equal(0);
        expect($X.find(() => 1)).to.equal(undefined);
        expect($X.innerHTML).to.equal(''); // dom element prop
        expect($X.value).to.equal(undefined); // INPUT prop
    };
    it('$() matched document', async () => {
        await fixture(html`
            <main>Hi</main>`);
        const $X = $$();
        expect($X[0]).to.equal(document);
        expect($X.$('main').innerText).to.equal('Hi');
    });
    it('blank NodeSet', async () => {
        const el = await fixture(html`
            <div></div>`);
        const $X = $$('a', el);
        isBlankNodeSet($X);
    });
    it('NodeSet[1]', async () => {
        const el = await fixture(html`
            <div><a>A</a><br/></div>`);
        const $X = $$('a', el);
        expect(Array.isArray($X)).to.equal(true);
        expect($X).to.be.an('array');
        expect($X.length).to.equal(1);
        expect($X[0].innerText).to.equal('A');
        expect($X[0].innerHTML).to.equal('A');
    });
    it('NodeSet[2]', async () => {
        const el = await fixture(html`
            <div><a href="Y">A</a><br/></div>`);
        const $X = $$('a,br', el);
        expect($X.length).to.equal(2);
        expect($X[0].href).to.include('Y');
        expect($X.href).to.include('Y');
        expect($X[0].innerHTML).to.equal('A');
        expect($X.innerHTML).to.equal('A');
    });
    it('[0] setter', async () => {
        const el = await fixture(html`
            <div></div>`);
        const $X = $$('a,b', el);
        $X.innerText = 'B';
        expect($X.innerHTML).to.equal('');
    });
    it('[2] setter', async () => {
        const el = await fixture(html`
            <div><a href="Y">A</a><b></b></div>`);
        const $X = $$('a,b', el);
        $X.innerText = 'B';
        expect($X[0].innerHTML).to.equal('B');
        expect($X[1].innerHTML).to.equal('B');
        expect($X.innerHTML).to.equal('BB');
    });
    it('chaining', async () => {
        const el = await fixture(html`
            <div><input type="number" value="1"/><input type="number" value="2"/></div>`);
        const $X = $$('input', el);
        $X.stepUp(2).stepDown();
        expect($X[0].value).to.equal('2');
        expect($X.value).to.equal('2');
        expect($X[1].value).to.equal('3');
    });
    it('checked in checkbox with click and click handlers', async () => {
        const el = await fixture(html`
            <div><input type="checkbox" value="1"/><input type="checkbox" value="2"/></div>`);
        const $X = $$<HTMLInputElement>('input', el);

        expect($X[0].checked).to.equal(false);
        expect($X.checked).to.equal(false);
        expect($X[1].checked).to.equal(false);

        $X.click();

        expect($X[0].checked).to.equal(true);
        expect($X.checked).to.equal(true);
        expect($X[1].checked).to.equal(true);

        $X.checked = false;

        expect($X[0].checked).to.equal(false);
        expect($X.checked).to.equal(false);
        expect($X[1].checked).to.equal(false);

        $X.addEventListener('click', function (this:HTMLInputElement) {
            this.value = 'clicked';
        })
        .addEventListener('change', function () {
            this.title = 'checked=' + this.checked;
        })
        .click();

        expect($X[0].value).to.equal('clicked');
        expect($X[1].value).to.equal('clicked');

        expect($X[0].title).to.equal('checked=true');
        expect($X[1].title).to.equal('checked=true');
    });
    it('$.on(evName, cb )', async () => {
        const el = await fixture(html`
            <div><input type="checkbox" value="1"/><input type="checkbox" value="2"/></div>`);
        const $X = $$('input', el);

        expect($X[0].checked).to.equal(false);
        expect($X.checked).to.equal(false);
        expect($X[1].checked).to.equal(false);

        $X.click();

        expect($X[0].checked).to.equal(true);
        expect($X.checked).to.equal(true);
        expect($X[1].checked).to.equal(true);

        $X.checked = false;

        expect($X[0].checked).to.equal(false);
        expect($X.checked).to.equal(false);
        expect($X[1].checked).to.equal(false);

        expect($X[0].value).to.equal('1');
        expect($X[1].value).to.equal('2');

        $X  .on('click', ev=>ev.target.title = "clicked")
            .on('change', ev=>ev.target.value = 'checked=' + ev.target.checked)
            .click();

        expect($X[0].title).to.equal('clicked');
        expect($X[1].title).to.equal('clicked');

        expect($X[0].value).to.equal('checked=true');
        expect($X[1].value).to.equal('checked=true');
    });
    it('custom element from import', async () => {
        const el = await fixture(html`
            <div>
                <demo-element/>
                <demo-element/>
            </div>`);
        const $X = $$<DemoElement>('demo-element', el, 'demo-element');

        expect($X.b).to.equal('initial');
        $X.setB('1');
        expect($X.b).to.equal('1');
        expect($X[0].b).to.equal('1');
        expect($X[1].b).to.equal('1');
    });
    it('custom element registered in run time', async () => {
        customElements.define('demo-element-1', class extends DemoElement {});
        $$<DemoElement>([], [], ['demo-element-1'])
        const el = await fixture(html`
            <div>
                <demo-element-1/>
                <demo-element-1/>
            </div>`);
        const $X = $$<DemoElement>('demo-element-1', el );

        expect($X.b).to.equal('initial');
        $X.setB('2');
        expect($X.b).to.equal('2');
        expect($X[0].b).to.equal('2');
        expect($X[1].b).to.equal('2');
    });
    it('init from set in run time', async () => {
        class DemoElement2 extends DemoElement {
            m2: number;

            constructor() {
                super();
                this.m2 = 2;
            }
        }

        customElements.define('demo-element-2', DemoElement2);

        const el = await fixture(html`
            <div>
                <demo-element-2/>
                <demo-element-2/>
            </div>`);
        const $X = $$<DemoElement2>('demo-element-2', el);

        expect($X.m2).to.equal(2);
        expect($X[0].m2).to.equal(2);
        expect($X[1].m2).to.equal(2);
    });
    it('init from element tag in run time', async () => {
        class DemoElement3 extends DemoElement {
            m3: number;
            constructor() {
                super();
                this.m3 = 3;
            }
        }

        customElements.define('demo-element-3', DemoElement3);

        const el = await fixture(html`
            <div>
                <demo-element-3/>
                <demo-element-3/>
            </div>`);
        const $X = $$<DemoElement3>('demo-element-3', el, 'demo-element-3');

        expect($X.m3).to.equal(3);
        expect($X[0].m3).to.equal(3);
        expect($X[1].m3).to.equal(3);
    });

    it('$.remove()', async () => {
        const el = await fixture(html`
            <div><input type="checkbox" value="1"/><input type="checkbox" value="2"/></div>`);
        const $X = $$('input', el).remove();
        isBlankNodeSet($X);
    });
    it('$.remove(evName, cb )', async () => {
        const el = await fixture(html`
            <div><input type="checkbox" value="1"/><input type="checkbox" value="2"/></div>`);
        const $X = $$('input', el);

        function markClick(this:HTMLInputElement) {
            this.name = 'clicked';
        }

        $X.on('click', markClick)
        .click(); // ON

        expect($X[0].name).to.equal('clicked');
        expect($X[1].name).to.equal('clicked');

        $X.title = "false";
        $X.name = "false";

        $X.on('click', function () {
            this.title = 'changed='+this.checked
        });
        $X.remove('click', markClick);

        $X.click(); // OFF
        expect($X[0].name).to.equal('false');
        expect($X[1].name).to.equal('false');

        expect($X[0].title).to.equal('changed=false');
        expect($X[1].title).to.equal('changed=false');
    });
    it('$(el)', async () => {

        const el = await fixture<HTMLElement>(
            html`<div><button>action</button></div>`
        );
        expect($$(el).length).to.equal(1);
        expect($$(el).$('button').txt()).to.equal('action');
    });
    it('$(css,el)', async () => {

        const el = await fixture<HTMLElement>(
            html`<div><button>action1</button><button>action2</button></div>`
        );
        expect($$(el).length).to.equal(1);
        expect($$('button',el).length).to.equal(2);
        expect($$('button',el).txt()).to.equal('action1action2');
    });
    it('$(css).txt(str)', async () => {

        const el = await fixture<HTMLElement>(
            html`<div><button>action1</button><button>action2</button></div>`
        );
        const $e = $$(el);
        expect($e.length).to.equal(1);
        const s:string = $e.txt()
        expect(s).to.equal('action1action2');
        expect($e.txt('erased').length).to.equal(1);
        expect($e.txt()).to.equal('erased');
        expect($e.$('button').length).to.equal(0);
        expect($e.$('button').txt()).to.equal('');
    });
    it('$(css).txt(str|cb)', async () => {

        const el = await fixture<HTMLElement>(
            html`<div><button id="b1">action1</button>:<button id="b2">action2</button></div>`
        );
        const $e = $$(el);
        expect($e.txt()).to.equal('action1:action2');

        expect($e.txt(e=>e.id,'button').length).to.equal(1);
        expect($e.txt()).to.equal('b1:b2');
        expect($e.$('button').length).to.equal(2);
        expect($e.$('button').txt()).to.equal('b1b2');


        const cb1 = (e:HTMLElementMixin)=>`${e.id}`;
        expect($e.txt(cb1,'button').length).to.equal(1);
        expect($e.txt()).to.equal('b1:b2');
        expect($e.$('button').length).to.equal(2);
        expect($e.$('button').txt()).to.equal('b1b2');

        const cb2 = (e:HTMLElementMixin,i:number)=>`${e.id}-${i}`;
        expect($e.txt(cb2,'button').length).to.equal(1);
        expect($e.txt()).to.equal('b1-0:b2-1');
        expect($e.$('button').length).to.equal(2);
        expect($e.$('button').txt()).to.equal('b1-0b2-1');

        const cb3 = (e:HTMLElementMixin,i:number,arr: HTMLElementMixin[])=>`${e.id}-${i}-${arr.length}`;
        expect($e.txt(cb3,'button').length).to.equal(1);
        expect($e.txt()).to.equal('b1-0-2:b2-1-2');
        expect($e.$('button').length).to.equal(2);
        expect($e.$('button').txt()).to.equal('b1-0-2b2-1-2');

        const cb4 = (e:HTMLElementMixin,i:number,arrCss: HTMLElementMixin[],arrThis: HTMLElementMixin[])=>`${e.id}-${i}-${arrCss.length}-${arrThis.length}`;
        expect($e.txt(cb4,'button').length).to.equal(1);
        expect($e.txt()).to.equal('b1-0-2-1:b2-1-2-1');
        expect($e.$('button').length).to.equal(2);
        expect($e.$('button').txt()).to.equal('b1-0-2-1b2-1-2-1');
    });

});
