ifneq ($(strip $(SECRET_1)),)
    # Escape special characters and wrap in quotes
    ESCAPED_SECRET := $(subst ",\",$(SECRET_1))
    OPT_DEFS += -DSECRET_1=\"$(ESCAPED_SECRET)\"
endif 