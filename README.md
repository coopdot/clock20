# Vigesimal time

This displays a clock in three rows. The top row is the year in human era (common era + 10000) and an extra digit for 1/20s of a year to replace months. The middle row is the date (0-18) with two digits for 1/400s of a day (216 seconds) to replace hours and minutes. The bottom row is seconds.

The digits ranges from 0 to 19, defaulting to "0123456789abcefghij" but this can be overrided by setting the `data-alphabet` attribute. (See examples in the examples directory.)

Setting the `data-rate` will change the update rate with the seconds per update. The rate ranges from 216 for the least often to 1/20 (or 0.05) for the most often.
