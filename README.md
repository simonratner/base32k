base32k
=======

Efficiently pack binary data into UTF-16 strings, with encoding overhead
approaching 6%.

Based on comments by [Perry A. Caro](mailto:caro@adobe.com),
[here](http://lists.xml.org/archives/xml-dev/200307/msg00505.html) and
[here](http://lists.xml.org/archives/xml-dev/200307/msg00507.html).

Usage
-----

    base32k.encode([1, 2, 3]);
    // => "㐀㐀告㐀䐀㐀㨀␆"

    base32k.decode(base32k.encode([1, 2, 3]));
    // => [1, 2, 3]

    base32k.decodeBytes(base32k.encodeBytes("Hello world!"));
    // => "Hello world!"

Comparison
----------
The following results show the maximum number of 4-byte ints that can be
stored in localStorage on `Google Chrome 19.0.1084.52 m`. JSON encoding
is variable-width, making smaller integers more efficient, but even in
the best case of all zeros its benefit is marginal.

    base64                                1,949,700 bytes (×2.66 overhead)
    base256                               2,605,060 bytes (×2.00 overhead)
    base32k                               4,898,820 bytes (×1.06 overhead)

    json (large integers)                   950,276 bytes equiv.
    json (small integers)                 1,785,860 bytes equiv.
    json (zeros)                          5,226,500 bytes equiv.

    base32k packed json (large integers)  1,785,860 bytes equiv.
    base32k packed json (small integers)  3,358,724 bytes equiv.
    base32k packed json (zeros)           9,814,020 bytes equiv.

Packed JSON packs 15 bytes into eight utf-16 characters, roughly doubling
the efficiency over ascii-only JSON; useful when encoding complex objects,
as long as they do not contain unicode strings.

`TODO:` Speed tests.
