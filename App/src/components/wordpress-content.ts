import {
    Component, Input, ElementRef, ViewContainerRef, Output,
    Compiler, EventEmitter, ComponentFactoryResolver,
    ComponentFactory, NgModule
} from '@angular/core'
import { Config } from '../app/config';

@Component({
    selector: 'wordpress-content',
    template: '<div #container></div>'
})
export class WordpressContent {


    @Input() content;
    @Output() link = new EventEmitter();
    constructor(
        private compiler: Compiler,
        private componentFactoryResolver: ComponentFactoryResolver,
        private elementRef: ElementRef,
        private viewContainerRef: ViewContainerRef,
        private config: Config
    ) {
    }
    ngOnChanges(changes) {

        var that = this;

        if (changes.content.currentValue != null) {

            let htmlTemplate = changes.content.currentValue;

            htmlTemplate = htmlTemplate.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
            htmlTemplate = htmlTemplate.replace(/<noscript\b[^<]*(?:(?!<\/noscript>)<[^<]*)*<\/noscript>/gi, '');

            // Remove Links Arround Images
            htmlTemplate = htmlTemplate.replace(/<a.*?(<img.*?>)<\/a>/gi, '$1');

            // Detect Internal Links
            htmlTemplate = htmlTemplate.replace(new RegExp('href=\"http:\/\/' + this.config.baseUrl + '\/(.+?)\.html\"', 'g'), '(click)="onInteralLink(\'$1\')"');


            // Fix broken Wordpress HTML (unclosed Tags etc)
            var doc = document.createElement('div');
            doc.innerHTML = htmlTemplate;

            htmlTemplate = doc.innerHTML;

            @Component({
                selector: 'viewRenderer',
                template: htmlTemplate,
            })
            class ViewRenderer {
                model: any;
                onInteralLink(page: string) {
                    that.link.emit(page);
                }
            }
            @NgModule({
                declarations: [ViewRenderer]
            })
            class DynamicModule { }

            this.compiler.compileModuleAndAllComponentsAsync(DynamicModule).then(
                factory => factory.componentFactories.find(x => x.componentType === ViewRenderer)
            ).then((factory: ComponentFactory<any>) => {
                this.viewContainerRef.createComponent(factory)
            })


        }
    }


}
