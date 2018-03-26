# postcss-mq

PostCSS plugin to reduce `media-queries` by target sizes.

## Installation

```sh
npm i --save-dev postcss-mq
```

## Configuration

### targets

**[{file: string, vw: number}]** Target list, where `vw` - the target width.

For example:

```js
{
  targets: [
    {
        file: `xxs.css`,
        vw: 500, // 0 - 500 px
    },
    {
        file: `xs.css`,
        vw: 1000, // 500 - 1000 px
    },
    {
        file: `s.css`,
        vw: 1300, // 1000 - 1300 px
    },
    {
        file: `m.css`,
        vw: 1900, // 1300 - 1900 px
    },
    {
        file: `l.css`,
        vw: 2500, // 1900 - 2500 px
    },
  ],
}
```

### output

**string** Path for the output files.

### comments

**boolean** Add comments for the processed rules.

For example for the target `500` - `900`:

*before*
```css
@media (min-width:250px) and (max-width:1000px) {
  .test5 {}
}
```

*after*
```css
/* starts: (min-width:250px) and (max-width:1000px) */
.test5 {}
/* ends: (min-width:250px) and (max-width:1000px) */"
```
