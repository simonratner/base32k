base32k
=======

Efficiently pack binary data into UTF-16 strings.
Encoding overhead approaches 6%.

Based on comments by Perry A. Caro [caro@adobe.com]:
    http://lists.xml.org/archives/xml-dev/200307/msg00505.html
    http://lists.xml.org/archives/xml-dev/200307/msg00507.html

The following results show the maximum number of 4-byte integers that can be
stored in localStorage on `Google Chrome 19.0.1084.52 m`. Json encoding is
variable-width, making smaller integers more efficient, but even in the
ideal case of all zeros the benefit over base32k is marginal.

    json (large integers)        950,276 bytes stored
    json (small integers)      1,785,860 bytes stored
    json (zeros)               5,226,500 bytes stored
    base64 (ascii string)      1,949,700 bytes stored
    base256 (ascii string)     2,605,060 bytes stored
    base32k (utf-16 string)    4,898,820 bytes stored

