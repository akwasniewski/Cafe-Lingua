<View style={styles.container}>
	<View style={styles.backCard}>
		<TouchableOpacity
			onPress={() => setCardState(false)}
			style={styles.backButton}>
			<Text style={styles.backText}>{props.curCard.back}</Text>
		</TouchableOpacity>
		<View style={styles.rating}>
			<TouchableOpacity style={styles.but1}>
				<Icon name='frown' color={'#FFFFFF'} size={26} />
			</TouchableOpacity>
			<TouchableOpacity style={styles.but2}>
				<Icon name='meh' color={'#FFFFFF'} size={26} />
			</TouchableOpacity>
			<TouchableOpacity style={styles.but3}>
				<Icon name='smile' color={'#FFFFFF'} size={26} />
			</TouchableOpacity>
		</View>
	</View>
</View>;
