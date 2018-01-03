import { Component, OnInit, ViewChild, ElementRef, Renderer } from '@angular/core';
import { HttpClient, HttpRequest, HttpHeaders } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {

  @ViewChild('scriptElement') public viewElement: ElementRef;

  request: string = null;

  public data: any = null;
  public html_pieChart: any = null;
  public html_multiBarChart: any = null;
  public html_discreteBarChart: any = null;

  noFilter() {
    this.http.get('http://localhost:9000/pie_chart').subscribe((data: any) => {
      this.html_pieChart = this._sanitizer.bypassSecurityTrustHtml(data.html);
      this.appendHTMLSnippetToDOM(data.script);
    });
    this.http.get('http://localhost:9000/multiBar_chart').subscribe((data: any) => {
      this.html_multiBarChart = this._sanitizer.bypassSecurityTrustHtml(data.html);
      console.log(this.html_multiBarChart);
      this.appendHTMLSnippetToDOM(data.script);
    });
    this.http.get('http://localhost:9000/discreteBar_chart').subscribe((data: any) => {
      this.html_discreteBarChart = this._sanitizer.bypassSecurityTrustHtml(data.html);
      this.appendHTMLSnippetToDOM(data.script);
    });

    this.request = "";
  }

  filter() {

    var headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Access-Control-Allow-Methods', 'POST')

    this.http.post('http://localhost:9000/multiBarChart_filtered', this.request, {
      headers: headers
    }
    ).subscribe((data: any) => {
      this.html_multiBarChart = this._sanitizer.bypassSecurityTrustHtml(data.html);
      this.appendHTMLSnippetToDOM(data.script);
    },
      err => {
        console.log("Error occured");
        alert("Please type a valid SQL request")
      }
      )

    this.http.post('http://localhost:9000/pieChart_filtered', this.request, {
      headers: headers
    }
    ).subscribe((data: any) => {
      this.html_pieChart = this._sanitizer.bypassSecurityTrustHtml(data.html);
      this.appendHTMLSnippetToDOM(data.script);
    },
      err => {
        console.log("Error occured");
      }
      )
    this.http.post('http://localhost:9000/discreteBarChart_filtered', this.request, {
      headers: headers
    }
    ).subscribe((data: any) => {
      this.html_discreteBarChart = this._sanitizer.bypassSecurityTrustHtml(data.html);
      this.appendHTMLSnippetToDOM(data.script);
    },
      err => {
        console.log("Error occured");
      }
      )
  }

  constructor(private http: HttpClient, private _sanitizer: DomSanitizer, public renderer: Renderer) {
  }

  ngOnInit() {
    this.noFilter();
  }

  public appendHTMLSnippetToDOM(script) {
    const element = this.viewElement.nativeElement;
    const fragment = document.createRange().createContextualFragment(script);
    element.appendChild(fragment);
  }

}