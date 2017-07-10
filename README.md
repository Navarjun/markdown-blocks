# markdown-blocks

This is a add-on to markdown file format which allows for adding additional html attributes and creating blocks in the markdown files.

It compiles `testMarkdown.md`

```
!#[div.col-sm-12](data='some-data')

!#[div.col-sm-12](data='some-data') detecting this is not good

!!#[div.col-sm-6.col-md-4]

Here goes other stuff !#[]
```javascript
!#[amazingness]
```.

```

to `testMarkdown.html`

```
<div class="col-sm-12" data='some-data'>
  <p>!#[div.col-sm-12](data=&#39;some-data&#39;) detecting this is not good</p>

  <div class="col-sm-6 col-md-4">
    <p>Here goes other stuff !#[]
      <code>javascript
        !#[amazingness]
      </code></p>
  </div>
</div>
```
