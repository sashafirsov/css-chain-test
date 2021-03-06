/* tests are using createTestTree(node) to
 * append the node clone with
 * initiated shadowDom on template parent ( id=host )
 */
import { CssChain as $ } from "./CssChain.js";

// from https://github.com/chromium/chromium/edit/main/third_party/blink/web_tests/external/wpt/shadow-dom/resources/shadow-dom.js
// changes:
//      * added walkLightDom() code to test $.template()
//      * createTestTree adds the cloned transformed node to parent

export function createTestTree( node )
{

    let ids = {light:{},native:{}};

    function attachShadowFromTemplate( template )
    {
        let parent = template.parentNode;
        parent.removeChild( template );
        let shadowRoot;
        if( template.getAttribute( 'data-slot-assignment' ) === 'manual' )
        {   /* c8 ignore next 5 */
            shadowRoot =
                parent.attachShadow( {
                    mode: template.getAttribute( 'data-mode' ),
                    slotAssignment: 'manual'
                } );
        }else
        {
            shadowRoot = parent.attachShadow(
                { mode: template.getAttribute( 'data-mode' ) } );
        }
        let id = template.id;
        /* c8 ignore next 5 */
        if( id )
        {
            shadowRoot.id = id;
            ids[ id ] = shadowRoot;
        }
        shadowRoot.appendChild( document.importNode( template.content, true ) );
        return shadowRoot;
    }

    function walkShadowDom( root )
    {   /* c8 ignore next 4 */
        if( root.id )
        {
            ids[ root.id ] = root;
        }
        for( let e of Array.from( root.querySelectorAll( '[id]' ) ) )
        {
            ids[ e.id ] = e;
        }
        for( let e of Array.from( root.querySelectorAll( 'template' ) ) )
        {
            walkShadowDom( attachShadowFromTemplate( e ) );
        }
    }

    function walkLightDom( root ) // using CssChain
    {   if( root.id )
            ids.light[ root.id ] = root;

        $( '[id]',root ).map( e => ids.light[ e.id ] = e );

        $( 'template', root )
            .map( t =>
            {   const p = t.parentNode;
                p.removeChild(t);
                const $rendered = $(p).template(t);
                $rendered.children.map( walkLightDom );
            });
    }

    const cloneAppend = (n,classname) =>
    {   let x = node.cloneNode( true );
        x.id=classname;
        x.classList.add(classname);

        if( classname==='light')
            ids.light[node.id]=x;
        else
            ids[node.id]=x;
        n.parentNode.appendChild(x);
        return x
    };

    walkLightDom( cloneAppend( node ,'light'  ) );
    walkShadowDom( cloneAppend( node,'shadow' ) );

    return ids;
}

// https://github.com/chromium/chromium/blob/main/third_party/blink/web_tests/external/wpt/shadow-dom/resources/shadow-dom.js#L1
export function removeWhiteSpaceOnlyTextNodes(node)
{
    for (var i = 0; i < node.childNodes.length; i++) {
        var child = node.childNodes[i];
        if (child.nodeType === Node.TEXT_NODE && child.nodeValue.trim().length == 0) {
            node.removeChild(child);
            i--;
        } else if (child.nodeType === Node.ELEMENT_NODE || child.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
            removeWhiteSpaceOnlyTextNodes(child);
        }
    }
    if (node.shadowRoot) {
        removeWhiteSpaceOnlyTextNodes(node.shadowRoot);
    }
}
