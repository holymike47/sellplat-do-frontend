import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostCreateEditComponent } from './post-create-edit.component';

describe('PostCreateEditComponent', () => {
  let component: PostCreateEditComponent;
  let fixture: ComponentFixture<PostCreateEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostCreateEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostCreateEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
