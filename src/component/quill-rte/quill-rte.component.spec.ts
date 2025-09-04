import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuillRteComponent } from './quill-rte.component';

describe('QuillRteComponent', () => {
  let component: QuillRteComponent;
  let fixture: ComponentFixture<QuillRteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuillRteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuillRteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
