base32k
=======

Efficiently pack binary data into UTF-16 strings, with encoding overhead
approaching 6%.

Based on comments by [Perry A. Caro](mailto:caro@adobe.com),
[here](http://lists.xml.org/archives/xml-dev/200307/msg00505.html) and
[here](http://lists.xml.org/archives/xml-dev/200307/msg00507.html).

Usage
-----

    base32k.encode([1,2,3]);
    // => "㐀㐀告㐀䐀㐀㨀␆"

    base32k.decode(base32k.encode([1,2,3]));
    // => [1, 2, 3]

Comparison
----------
The following results show the maximum number of 4-byte ints that can be
stored in localStorage on `Google Chrome 19.0.1084.52 m`. Json encoding
is variable-width, making smaller integers more efficient, but even in
the best case of all zeros its benefit is marginal.

    json (large integers)        950,276 bytes stored
    json (small integers)      1,785,860 bytes stored
    json (zeros)               5,226,500 bytes stored
    base64 (ascii string)      1,949,700 bytes stored
    base256 (ascii string)     2,605,060 bytes stored
    base32k (utf-16 string)    4,898,820 bytes stored

