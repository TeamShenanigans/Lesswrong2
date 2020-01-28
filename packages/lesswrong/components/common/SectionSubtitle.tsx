import React from 'react';
import { registerComponent } from 'meteor/vulcan:core';
import { createStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import classNames from 'classnames'

const styles = createStyles((theme) => ({
  root: {
    ...theme.typography.body2,
    ...theme.typography.commentStyle,
    color: theme.palette.grey[700],
    display: "inline-block",
    marginBottom: theme.spacing.unit/2
  }
}))

const SectionSubtitle = ({children, classes, className}: {
  children?: any,
  classes: any,
  className?: string,
}) => {
  return <Typography component='span' variant='subheading' className={classNames(classes.root, className)}>
    {children}
  </Typography>
}

const SectionSubtitleComponent = registerComponent('SectionSubtitle', SectionSubtitle, {styles})

declare global {
  interface ComponentTypes {
    SectionSubtitle: typeof SectionSubtitleComponent
  }
}